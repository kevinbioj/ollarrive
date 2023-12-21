package fr.kevinbioj.ollarrive.server;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition
@SpringBootApplication
public class OllarriveApplication {

	public static void main(String[] args) {
		SpringApplication.run(OllarriveApplication.class, args);
	}

}
