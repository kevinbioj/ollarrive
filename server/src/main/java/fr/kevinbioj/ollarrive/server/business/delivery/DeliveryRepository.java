package fr.kevinbioj.ollarrive.server.business.delivery;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<DeliveryEntity, UUID> {

}
