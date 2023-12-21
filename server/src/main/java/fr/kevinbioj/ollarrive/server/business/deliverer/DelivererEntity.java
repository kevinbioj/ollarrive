package fr.kevinbioj.ollarrive.server.business.deliverer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@Table(name = "deliverer")
public class DelivererEntity {

  public static final int NAME_LIMIT = 32;

  // ---

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(length = NAME_LIMIT, nullable = false)
  private String name;

  @Column(nullable = false)
  private boolean available;

  @Column(nullable = false, updatable = false)
  @CreationTimestamp
  private Instant createdAt;
}
