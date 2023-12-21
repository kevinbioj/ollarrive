package fr.kevinbioj.ollarrive.server.business.deliverer;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DelivererRepository extends JpaRepository<DelivererEntity, UUID>,
    JpaSpecificationExecutor<DelivererEntity> {

}
