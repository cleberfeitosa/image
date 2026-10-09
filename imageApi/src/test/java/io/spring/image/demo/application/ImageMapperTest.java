package io.spring.image.demo.application;

import io.spring.image.demo.domain.entity.Image;
import io.spring.image.demo.domain.enums.ImageExtension;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ImageMapperTest {

    private final ImageMapper mapper = new ImageMapper();

    @Test
    void formatsUploadDateInBrazilianFormat() {
        var image = Image.builder()
                .name("Imagem")
                .extension(ImageExtension.PNG)
                .size(100L)
                .uploadDate(LocalDateTime.of(2026, 10, 8, 12, 0))
                .build();

        var dto = mapper.imageToDTO(image, "http://localhost:8080/images/1");

        assertEquals("08/10/2026", dto.getUploadDate());
    }
}
