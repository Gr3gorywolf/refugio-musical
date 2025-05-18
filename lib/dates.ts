export const formatTime = (time: number) => {
    const timeDate = new Date(time * 1000)
    const hours = timeDate.getHours().toString().padStart(2, "0")
    const minutes = timeDate.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`;
}