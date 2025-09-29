import axios from "axios";
import { useState } from "react";

export default function UploadMultiple() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3); 

    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
    setDescriptions(Array(selectedFiles.length).fill("")); 
  };

  const handleChangeDescription = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }

    if (descriptions.some((desc) => !desc.trim())) {
      alert("Vui lòng nhập mô tả cho ảnh");
      return;
    }

    setIsLoading(true);
    const urls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        formData.append("context", `alt=${descriptions[i]}`);

        const apiUrl = import.meta.env.VITE_API_CLOUD;
        const response = await axios.post(apiUrl, formData);

        urls.push({ url: response.data.url, description: descriptions[i] });
      }

      setImageUrls(urls);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
      setPreviews([]);
      setFiles([]);
      setDescriptions([]);
    }
  };

  return (
    <div>
      {isLoading && <div>Đang tải lên...</div>}

      {previews.length > 0 && (
        <>
          <h3>Hình ảnh xem trước:</h3>
          {previews.map((prev, index) => (
            <div key={index}>
              <img height={200} width={300} src={prev} alt={`Xem trước ${index + 1}`} />
              <input
                type="text"
                placeholder={`Mô tả ảnh ${index + 1}`}
                value={descriptions[index]}
                onChange={(e) => handleChangeDescription(index, e.target.value)}
              />
            </div>
          ))}
        </>
      )}

      {imageUrls.length > 0 && (
        <>
          <h3>Hình ảnh sau khi upload:</h3>
          {imageUrls.map((img, index) => (
            <div key={index}>
              <img height={200} width={300} src={img.url} alt={`Ảnh ${index + 1}`} />
              <p>Mô tả: {img.description}</p>
            </div>
          ))}
        </>
      )}

      <input type="file" multiple onChange={handleChangeInput} />
      <button onClick={handleUploadFiles}>Upload</button>
    </div>
  );
}
