import { useState } from "react";

function buildAdminImageUrl(basePath, filename) {
  const image = String(filename || "").trim();
  if (!image) return "";
  if (/^(https?:)?\/\//i.test(image) || /^(data|blob):/i.test(image)) return image;
  return `${String(basePath || "").replace(/\/?$/, "/")}${image.replace(/^\//, "")}`;
}

export default function ImagePathPreview({
  basePath = "",
  filename = "",
  url = "",
  alt = "Uploaded image",
  imageClassName = "mx-auto h-16 w-20 rounded border border-slate-200 object-cover",
  showPath = true,
}) {
  const imageUrl = url || buildAdminImageUrl(basePath, filename);
  const [failedUrl, setFailedUrl] = useState("");
  const failed = failedUrl === imageUrl;

  if (!imageUrl) {
    return <span className="text-xs font-medium text-red-600">No image path</span>;
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <a href={imageUrl} target="_blank" rel="noreferrer" title={imageUrl}>
        {failed ? (
          <span className="flex h-16 w-20 items-center justify-center rounded border border-red-200 bg-red-50 px-2 text-center text-[10px] font-semibold text-red-600">
            Image 404
          </span>
        ) : (
          <img src={imageUrl} alt={alt} className={imageClassName} onError={() => setFailedUrl(imageUrl)} />
        )}
      </a>
      {showPath && (
        <a href={imageUrl} target="_blank" rel="noreferrer" title={imageUrl} className="text-[11px] font-medium leading-4 text-blue-600 hover:underline">
          View image
        </a>
      )}
    </div>
  );
}
