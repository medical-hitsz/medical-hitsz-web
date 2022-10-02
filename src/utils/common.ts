export const uerAgentIsPC = () => {
  return !navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
};

export const filterNumberString = (str: string, length: number) => {
  if (length) {
    return [...str]
      .filter((v) => v >= "0" && v <= "9")
      .slice(0, length)
      .join("");
  } else {
    return [...str].filter((v) => v >= "0" && v <= "9").join("");
  }
};

export const phoneNumberFormat = (value: string | number) =>
  /^1\d{10}$/.test(String(value));

export const msgCodeFormat = (value: string | number) =>
  /^\d{6}$/.test(String(value));

export const getFormat = (path: string) => {
  const lastIdx = path.lastIndexOf(".");
  return (lastIdx >= 0 && path.length) > lastIdx + 1 ? path.slice(lastIdx) : "";
};

// 获取媒体类型，如"image"||"video"||""
export const getFileType = (path: string) => {
  const lastIdx = path.lastIndexOf(".");
  if (lastIdx < 0) {
    return "";
  }
  const format = path.length > lastIdx + 1 ? path.slice(lastIdx) : "";
  if (!format) {
    return "";
  }
  const image = [
    ".tif",
    ".pjp",
    ".xbm",
    ".jxl",
    ".svgz",
    ".jpg",
    ".jpeg",
    ".ico",
    ".tiff",
    ".gif",
    ".svg",
    ".jfif",
    ".webp",
    ".png",
    ".bmp",
    ".pjpeg",
    ".avif",
  ];
  const video = [
    ".ogm",
    ".wmv",
    ".mpg",
    ".webm",
    ".ogv",
    ".mov",
    ".asx",
    ".mpeg",
    ".mp4",
    ".m4v",
    ".avi",
  ];
  if (image.indexOf(format) >= 0) {
    return "image";
  } else if (video.indexOf(format) >= 0) {
    return "video";
  }
  return format;
};

export const getDateFormat = (targetDate: Date, now?: Date) => {
  const nowDate = now || new Date();
  const hours = targetDate.getHours();
  const minutes =
    targetDate.getMinutes() < 10
      ? "0" + targetDate.getMinutes()
      : targetDate.getMinutes();
  if (targetDate.toDateString() === nowDate.toDateString()) {
    return `今天 ${hours}:${minutes}`;
  }
  const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (targetDate.toDateString() === yesterdayDate.toDateString()) {
    return `昨天 ${hours}:${minutes}`;
  }
  if (targetDate.getFullYear() === nowDate.getFullYear()) {
    return `${
      targetDate.getMonth() + 1
    }/${targetDate.getDate()} ${hours}:${minutes}`;
  }
  return `${targetDate.getFullYear()}/${
    targetDate.getMonth() + 1
  }/${targetDate.getDate()} ${targetDate.getHours()}:${minutes}`;
};
