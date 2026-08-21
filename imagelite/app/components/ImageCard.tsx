interface ImageCardProps {
  imageUrl?: string;
  imageName?: string;
  imageSize?: string;
  uploadDate?: string;
} 

export  const ImageCard: React.FC<ImageCardProps> = ({imageName, imageUrl, imageSize, uploadDate }) => {
  return(
    <div className="card relative bg-white rounded-md shadow-md transition-all ease-in-out duration-300 hover:shadow-xl hover:-translate-y-1"> 
  <img src={imageUrl} className="h-56 w-full object-cover rounded-t-md" alt="Thumbnail" />
  <div className="card-body p-4">
    <h1 className="text-xl font-semibold mb-2 text-gray-600">{imageName}</h1>
    <p className="text-xl font-semibold mb-2 text-gray-600">{imageSize}</p>
    <p className="text-xl font-semibold mb-2 text-gray-600">{uploadDate}</p>
  </div>
</div>
    
    

  )

}