import { useLocation } from "react-router-dom";

const ShowImages = () => {
    const location = useLocation();
    const { imageUrls = [] } = location.state || {}; // Default to empty array

    // Function to download an image
    const downloadImage = (url, index) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `event_image_${index + 1}.jpg`; // Customize filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-wrap gap-4 p-4">
            {imageUrls.length === 0 ? (
                <p className="text-gray-500">No images available.</p>
            ) : (
                
                imageUrls.map((url, index) => (
                    <div key={index}>
                      <img
                        src={url}
                        alt={`Event Image ${index + 1}`}
                        className="w-[300px] h-auto rounded-lg shadow-lg"
                      />
                      <a href={url} download={`event-image-${index}.jpg`}>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                          Download
                        </button>
                      </a>
                    </div>
                  ))
                  
            )}
        </div>
    );
};

export default ShowImages;
