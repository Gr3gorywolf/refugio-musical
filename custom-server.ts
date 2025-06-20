import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import next from "next";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { parse } from "url";
import fs from "fs";
import path from "path";
import { generateUserChatColor } from "./lib/utils";
import { ChatUser } from "./types/ChatUser";
import Validator from "validatorjs";
Validator.useLang('es');
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


interface CustomRequest extends Request {
  user?: ChatUser;
  token?: string;
}

let messages: any[] = [];
let activeUsers = new Map<string, ChatUser>();
const usersCache = new Map<string, ChatUser>();

// JSON persistence
const messagesFilePath = path.join(__dirname, "chat-data.json");
const tokensFilePath = path.join(__dirname, "tokens.json");
function getUniqueActiveUsers() {
  const uniqueUsers = new Map<string, ChatUser>();
  activeUsers.forEach((user) => {
    if (!uniqueUsers.has(user.id)) {
      uniqueUsers.set(user.id, user);
    }
  });
  console.log(Array.from(uniqueUsers.values()))
  return Array.from(uniqueUsers.values());
}
function loadData() {
  try {
    if (fs.existsSync(messagesFilePath)) {
      const raw = fs.readFileSync(messagesFilePath, "utf-8");
      const data = JSON.parse(raw);
      messages = data || [];
    }
    if (fs.existsSync(tokensFilePath)) {
      const raw = fs.readFileSync(tokensFilePath, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        for (const item of data) {
          usersCache.set(item.token, item.user);
        }
      }
    }
    console.log("✅ Cache loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load cache:", err);
  }
}

function saveMessages() {
  try {

    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Failed to save messages:", err);
  }
}

function saveTokens() {
  try {
    const tokens = Array.from(usersCache.entries()).map(([token, value]) => ({
      token,
      user: value
    }));
    fs.writeFileSync(tokensFilePath, JSON.stringify(tokens, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Failed to save tokens:", err);
  }
}

loadData();

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [token, user] of usersCache.entries()) {
    if (!user.lastLogin || now - user.lastLogin > TWO_DAYS_MS) {
      usersCache.delete(token);
      changed = true;
    }
  }
  if (changed) {
    console.log("🧹 Cleaned up inactive users");
    saveTokens();
  }
}, 60 * 60 * 1000);

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  expressApp.use(express.json());

  async function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    try {
      if (!token) throw new Error("Token required");
      const user = usersCache.get(token);
      if (user) {
        req.user = user;
        req.token = token;
        next();
      } else {
        res.status(401).json({ error: "Unauthorized" });
        return
      }
    } catch (err: any) {
      console.error(err);
      next(err);
    }
  }

  expressApp.post("/api/login", async (req: CustomRequest, res: Response) => {
    const { socketId, userName, email } = req.body;
    if (!socketId) {
      res.status(400).json({ error: "No socketId specified" })
      return;
    };

    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      res.status(404).json({ error: "Socket not found" })
      return;
    };
    const validation = new Validator(req.body, {
      userName: "required|min:3|max:15",
      email: "required|email",
    })
    if (validation.fails()) {
      const errors = validation.errors.all();
      res.status(400).json({ error: "Validation failed", errors });
      return;
    }
    const user: ChatUser = {
      id: btoa(email.trim().toLowerCase() + userName.trim().toLowerCase()),
      name: userName,
      email: email,
      lastLogin: Date.now(),
    }
    const token = btoa(`${user.id}:${Date.now()}`);
    usersCache.set(token, user)
    activeUsers.set(socket.id, user);
    saveTokens()
    io.emit("active-users", getUniqueActiveUsers().length);
    res.status(200).json({ success: true, user, token });
  });

  expressApp.post("/api/auth-socket", verifyToken, async (req: CustomRequest, res: Response) => {
    const { socketId } = req.body;
    if (!socketId) {
      res.status(400).json({ error: "No socketId specified" })
      return;
    };

    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      res.status(404).json({ error: "Socket not found" })
      return;
    };
    activeUsers.set(socket.id, req.user!);
    if (req.token && req.user) {
      usersCache.set(req.token, {
        ...req.user!,
        lastLogin: Date.now(),
      })
    }

    io.emit("active-users", getUniqueActiveUsers().length);
    res.status(200).json({ success: true });
  });

  expressApp.post("/api/send-message", verifyToken, (req: CustomRequest, res: Response) => {
    const { text, socketId } = req.body;
    const activeUser = activeUsers.get(socketId);
    if (!text) {
      res.status(400).json({ error: "A message must be specified" })
      return;
    };
    if (!activeUser || activeUser.id !== req.user?.id) {
      res.status(401).json({ error: "Unauthorized" })
      return;
    };

    const message = {
      id: Date.now().toString(),
      username: req.user!.name,
      text,
      color: generateUserChatColor(req.user!.id),
      timestamp: new Date(),
    };

    messages.push(message);
    if (messages.length > 3000) messages.shift();

    saveMessages();
    io.emit("new-message", message);
    res.json({ success: true });
  });

  expressApp.post("/api/logout", verifyToken, (req: CustomRequest, res: Response) => {
    const { socketId } = req.body;
    const activeUser = activeUsers.get(socketId);
    if (activeUser && activeUser.id === req.user?.id) {
      activeUsers.delete(socketId);
      usersCache.delete(req.token!);
      io.emit("active-users", getUniqueActiveUsers().length);
      saveTokens()
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "User not active or not found" });
    }
  });

  expressApp.get("/api/chat-status", (_req: Request, res: Response) => {
    res.json({
      messages,
      activeUsers: getUniqueActiveUsers().length,
    });
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () => {
      if (activeUsers.has(socket.id)) {
        console.log(`Socket disconected: ${socket.id}`);
        activeUsers.delete(socket.id);
        io.emit("active-users", getUniqueActiveUsers().length);
      }
    });
  });

  expressApp.all(/(.*)/, (req: Request, res: Response) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Server running at: http://localhost:${PORT}`);
  });
});
