import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import next from "next";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { parse } from "url";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

import { FacebookUser } from "./types/FacebookUser";
import { FacebookDebugData } from "./types/FacebookDebugData";
import { generateUserChatColor } from "./lib/utils";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

interface User {
  id: string;
  name: string;
  picture?: string;
  email?: string;
}

interface CustomRequest extends Request {
  user?: User;
}

let messages: any[] = [];
let activeUsers = new Map<string, User>();
const tokenCache = new Map<string, { user: User; expiresAt: number }>();

// JSON persistence
const dataFilePath = path.join(__dirname, "chat-data.json");
function getUniqueActiveUsers() {
  const uniqueUsers = new Map<string, User>();
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
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, "utf-8");
      const data = JSON.parse(raw);
      messages = data.messages || [];
      if (Array.isArray(data.tokens)) {
        for (const item of data.tokens) {
          tokenCache.set(item.token, {
            user: item.user,
            expiresAt: item.expiresAt,
          });
        }
      }
      console.log("✅ Cache persisted");
    }
  } catch (err) {
    console.error("❌ Failed to load cache:", err);
  }
}

function saveData() {
  try {
    const tokens = Array.from(tokenCache.entries()).map(([token, value]) => ({
      token,
      user: value.user,
      expiresAt: value.expiresAt,
    }));
    const data = { messages, tokens };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Failed to save cache:", err);
  }
}

loadData();

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  expressApp.use(express.json());

  async function verifyFacebookToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) throw new Error("Token required");

    const cached = tokenCache.get(token);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      req.user = cached.user;
      return next();
    }

    try {
      const debugRes = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`
      );
      const debugData = (await debugRes.json()) as FacebookDebugData;
      const tokenInfo = debugData.data;

      if (!tokenInfo?.is_valid || !tokenInfo.expires_at)
        throw new Error("Invalid token");

      const fbRes = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${token}`
      );
      const fbUser = (await fbRes.json()) as FacebookUser;

      const userData: User = {
        id: fbUser.id,
        name: fbUser.name,
        picture: fbUser.picture?.data?.url,
        email: fbUser.email,
      };

      const tokenExpiration = tokenInfo.expires_at * 1000;
      const standardExpiration = now + 1800 * 1000;
      tokenCache.set(token, {
        user: userData,
        expiresAt: standardExpiration <= tokenExpiration ? standardExpiration : tokenExpiration,
      });

      saveData();

      req.user = userData;
      next();
    } catch (err: any) {
      console.error(err);
      next(err);
    }
  }

  expressApp.post("/api/auth-socket", verifyFacebookToken, async (req: CustomRequest, res: Response) => {
    const { socketId } = req.body;
    const user = req.user;
    if (!socketId) {
      res.status(400).json({ error: "No socketId specified" })
      return;
    };

    const socket = io.sockets.sockets.get(socketId);
    if (!socket)  {
      res.status(404).json({ error: "Socket not found" })
      return;
    };

    activeUsers.set(socket.id, user!);
    io.emit("active-users", getUniqueActiveUsers().length);
    res.status(200).json({ success: true, user });
  });

  expressApp.post("/api/send-message", verifyFacebookToken, (req: CustomRequest, res: Response) => {
    const { text, socketId } = req.body;
    const activeUser = activeUsers.get(socketId);

    if (!text) res.status(400).json({ error: "A message must be specified" });
    if (!activeUser || activeUser.id !== req.user?.id) res.status(403).json({ error: "Unauthorized" });

    const message = {
      id: Date.now().toString(),
      username: req.user!.name,
      text,
      color: generateUserChatColor(req.user!.id),
      timestamp: new Date(),
    };

    messages.push(message);
    if (messages.length > 3000) messages.shift();

    saveData();
    io.emit("new-message", message);
    res.json({ success: true });
  });

  expressApp.post("/api/logout", verifyFacebookToken, (req: CustomRequest, res: Response) => {
    const { socketId } = req.body;
    const activeUser = activeUsers.get(socketId);
    if (activeUser && activeUser.id === req.user?.id) {
      activeUsers.delete(socketId);
      io.emit("active-users", getUniqueActiveUsers().length);
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
