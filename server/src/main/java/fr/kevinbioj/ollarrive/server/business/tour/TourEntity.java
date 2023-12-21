package fr.kevinbioj.ollarrive.server.business.tour;

import fr.kevinbioj.ollarrive.server.business.deliverer.DelivererEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Data;

@Data
@Entity
@Table(name = "tour")
public class TourEntity {

  public static final int NAME_LIMIT = 64;

  // ---

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(length = NAME_LIMIT, nullable = false)
  private String name;

  @Column(nullable = false)
  private OffsetDateTime startDate;

  @Column(nullable = false, updatable = false)
  private OffsetDateTime endDate;

  @ManyToOne
  private DelivererEntity deliverer;
}
