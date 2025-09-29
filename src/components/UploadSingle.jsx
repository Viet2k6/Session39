import axios from "axios";
import { useState } from "react";

export default function UploadSingle() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeFile = (event) => {
    const fileName = event.target.files[0];

    if (fileName) {
      setFile(event.target.files[0]);
      setPreview(URL.createObjectURL(fileName));
    }
  };

  const handleUploadFile = async () => {
    if (!file) {
      alert("Vui lòng chọn ảnh");
      return;
    }

    if (!description.trim()) {
      alert("Vui lòng nhập mô tả ảnh");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("context", `alt=${description}`);

    const apiUrl = import.meta.env.VITE_API_CLOUD;

    setIsLoading(true);
    try {
      const response = await axios.post(apiUrl, formData);
      setImageUrl(response.data.url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setPreview(false);
    }
  };

  return (
    <div>
      {isLoading && <div>Đang tải lên...</div>}

      {preview && (
        <>
          <h3>Hình ảnh xem trước:</h3>
          <img height={200} width={300} src={preview} alt="Ảnh xem trước" />
        </>
      )}

      {imageUrl && (
        <>
          <h3>Hình ảnh sau khi upload:</h3>
          <img height={200} width={300} src={imageUrl} alt="Ảnh xem sau khi upload" />
          <p>Mô tả: {description}</p>
        </>
      )}

      <input type="file" onChange={handleChangeFile} />
      <input
        type="text"
        placeholder="Nhập mô tả ảnh"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleUploadFile}>Upload</button>
    </div>
  );
}
