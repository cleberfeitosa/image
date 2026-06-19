package io.spring.image.demo.infra.repository.specs;

import org.springframework.beans.factory.BeanRegistry;
import org.springframework.data.jpa.domain.Specification;

public class GenericSpecs {

    private GenericSpecs(){};
    public static <T> Specification<T> conjunction(){
        return (root, q, criteriaBuilder) ->criteriaBuilder.conjunction();
    };

}
