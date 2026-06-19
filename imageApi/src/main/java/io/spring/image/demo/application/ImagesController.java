package io.spring.image.demo.application;

import io.spring.image.demo.domain.entity.Image;
import io.spring.image.demo.domain.enums.ImageExtension;
import io.spring.image.demo.domain.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/images")
@Slf4j
@RequiredArgsConstructor
public class ImagesController {

    private final ImageService service;
    private final ImageMapper mapper;


    //*
    // {"name": "", "size":100} //application/json
    //*

    // mult-part/formdata
    //*

    @PostMapping
    public ResponseEntity save(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("tags") List<String> tags
    ) throws IOException {
        log.info("Recebendo tentativa de upload do arquivo: {}", file.getOriginalFilename());
//            log.info("Content Type:{} ", file.getContentType());
//            log.info("Media Type:{} ", MediaType.valueOf(file.getContentType()));
//            try {
//                // Lógica de processamento...
//                if (file.isEmpty()) {
//                    log.warn("O arquivo enviado estava vazio!");
//                    return ResponseEntity.badRequest().body("Arquivo vazio");
//                }
//
//                log.info("Tamanho do arquivo recebido: {} bytes", file.getSize());
//                log.info("Nome definido para a imagem: {}", name);
//                log.info("Tags: {}", tags);
//
//
//                return ResponseEntity.ok("Imagem enviada com Sucesso!!!!");
//            } catch (Exception e) {
//                // Sempre passe a exceção 'e' como último argumento para imprimir o StackTrace
//                log.error("Falha crítica ao processar imagem: ", e);
//                return ResponseEntity.internalServerError().body("Erro no servidor");
//            }

        Image image = mapper.mapToImage(file, name, tags);
        Image savedImage = service.save(image);
        URI imageUri = buildImageURL(savedImage);
        //http://localhost:8080/upload/asfsdfsfg01012;  url

        //return ResponseEntity.ok().build();
        return ResponseEntity.created(imageUri).build();
    }

    @GetMapping("{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable("id") String id) {
        var possibleImage = service.getById(id);
        if (possibleImage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var image = possibleImage.get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(image.getExtension().getMediaType());
        headers.setContentLength(image.getSize());
        // inline; filename="image.PNG"
        headers.setContentDispositionFormData("inline; filename=\"" + image.getFileName() + "\"", image.getFileName());

        return new ResponseEntity<>(image.getFile(), headers, HttpStatus.OK);
    }

    //localhost:8080/images?extension=PNG&query=Nature
    @GetMapping
    public ResponseEntity<List<ImageDTO>> search(
            @RequestParam(value = "extension", required = false, defaultValue = "") String extension,
            @RequestParam(value = "query", required = false) String query) throws InterruptedException {
        Thread.sleep(3000L);
        //var result = service.search(ImageExtension.valueOf(extension), query);
        var result = service.search(ImageExtension.ofName(extension), query);

        var images = result.stream().map(image -> {
            var url = buildImageURL(image);
            return mapper.imageToDTO(image, url.toString());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(images);
    }


    //método que cria a url da imagem
    private URI buildImageURL(Image image) {
        String imagePath = "/" + image.getId();
        return ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path(imagePath)
                .build().toUri();
    }
}
