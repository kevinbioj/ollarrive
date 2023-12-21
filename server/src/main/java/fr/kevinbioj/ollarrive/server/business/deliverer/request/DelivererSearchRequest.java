package fr.kevinbioj.ollarrive.server.business.deliverer.request;

import fr.kevinbioj.ollarrive.server.business.deliverer.DelivererEntity;
import fr.kevinbioj.ollarrive.server.validation.OneOf;
import jakarta.validation.constraints.Min;
import java.time.OffsetDateTime;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

@Data
public class DelivererSearchRequest {

  /* Critères de recherche */

  @Length(max = DelivererEntity.NAME_LIMIT, message = "name.length")
  private String name;

  private Boolean available;

  private OffsetDateTime createdAfter;

  private OffsetDateTime createdBefore;

  /* Paramètres de tri */

  @OneOf(value = {"name", "available", "createdAt"}, message = "sortBy.invalid")
  private String sortBy;

  @OneOf(value = {"asc", "desc"}, message = "sortOrder.invalid")
  private String sortOrder;

  /* Paramètres de pagination */

  @Min(value = 0, message = "page.min")
  private Integer page = 0;

  @Range(min = 1, max = 20, message = "limit.range")
  private Integer limit = 10;
}
