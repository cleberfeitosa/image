package io.spring.image.demo.application;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImageDTO {
    private String url;
    private String name;
    private String extension;
    private Long size;
    private String uploadDate;
}
