using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
//using CloudinaryDotNet;
//using CloudinaryDotNet.Actions;


[Route("api/[controller]")]
[ApiController]
public class ProductsUploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;

    public ProductsUploadController(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;

    }


        [HttpPost]
        public async Task<IActionResult> UploadProductImages()
        {
           
         try
            {

                var form = await Request.ReadFormAsync();
            
                var mainImageUrl = await HandleFileUpload(form.Files.FirstOrDefault(f => f.Name == "mainImage"));

                // Upload gallery images
                
                var galleryUrls = new List<string>();
                foreach (var file in form.Files.Where(f => f.Name == "galleryImages"))
                {
                    galleryUrls.Add(await HandleFileUpload(file));
                }

                return Ok(new { 
                    mainImageUrl,
                    galleryUrls
                });
             }

            catch (Exception ex)
            {
                
                return StatusCode(500, new { 
                    error = "File upload failed",
                    details = ex.Message
                });
            }
}



    private async Task<string> HandleFileUpload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        if (string.IsNullOrWhiteSpace(file.FileName))
        throw new Exception("File name is missing for one of the uploaded files.");

        return await SaveToLocalStorage(file);

        // Choose either local storage or cloud storage
        /* if (_config["StorageType"] == "Cloudinary")
        {
            return await UploadToCloudinary(file);
        }
        else
        {
            return await SaveToLocalStorage(file);
        }*/
    }

            private async Task<string> SaveToLocalStorage(IFormFile file)
        {
            // Ensure web root is set
            var webRootPath = _env.WebRootPath;
            if (string.IsNullOrEmpty(webRootPath))
            {
                webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                Directory.CreateDirectory(webRootPath);
            }

            var uploadsFolder = Path.Combine(webRootPath, "uploads");
            Directory.CreateDirectory(uploadsFolder);

            
            var originalFileName = file.FileName;
            if (string.IsNullOrWhiteSpace(originalFileName))
            {
                throw new Exception("The file name is missing.");
            }
            var fileName = Path.GetFileName(originalFileName);
            
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"/uploads/{uniqueFileName}";
        }

/*
        private async Task<string> UploadToCloudinary(IFormFile file)
    {
        if (file == null)
            throw new ArgumentNullException(nameof(file));

        // Create the Cloudinary account instance
        var account = new Account(
            _config["Cloudinary:CloudName"],
            _config["Cloudinary:ApiKey"],
            _config["Cloudinary:ApiSecret"]
        );
        var cloudinary = new Cloudinary(account);

     
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Folder = "products"
        };

        
        var uploadResult = await cloudinary.UploadAsync(uploadParams);

      
        if (uploadResult.Error != null)
        {
            throw new Exception(uploadResult.Error.Message);
        }

        return uploadResult.SecureUrl?.ToString() ?? throw new Exception("Upload failed, no URL returned");
    }*/

}