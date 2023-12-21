package fr.kevinbioj.ollarrive.server.business.delivery;

import fr.kevinbioj.ollarrive.server.business.tour.TourEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Data;

@Data
@Entity
@Table(name = "delivery")
public class DeliveryEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String pickupAddress;

  @Column(nullable = false)
  private String deliveryAddress;

  @ManyToOne
  private TourEntity tour;
}
