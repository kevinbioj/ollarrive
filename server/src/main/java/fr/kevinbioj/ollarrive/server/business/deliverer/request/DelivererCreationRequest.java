package fr.kevinbioj.ollarrive.server.business.deliverer.request;

import fr.kevinbioj.ollarrive.server.business.deliverer.DelivererEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class DelivererCreationRequest {

  @NotBlank(message = "name.required")
  @Length(max = DelivererEntity.NAME_LIMIT, message = "name.length")
  private String name;

  @NotNull(message = "available.required")
  private Boolean available;
}
