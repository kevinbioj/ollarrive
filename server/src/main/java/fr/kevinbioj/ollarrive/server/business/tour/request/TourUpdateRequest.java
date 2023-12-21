package fr.kevinbioj.ollarrive.server.business.tour.request;

import fr.kevinbioj.ollarrive.server.business.tour.TourEntity;
import fr.kevinbioj.ollarrive.server.validation.DateRange;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@DateRange(minField = "startDate", maxField = "endDate", message = "endDate.beforeStart")
public class TourUpdateRequest {

  @NotBlank(message = "name.required")
  @Length(max = TourEntity.NAME_LIMIT, message = "name.length")
  private String name;

  @NotNull(message = "startDate.required")
  private OffsetDateTime startDate;

  @NotNull(message = "endDate.required")
  private OffsetDateTime endDate;

  private UUID delivererId;
}
