package fr.kevinbioj.ollarrive.server.business.tour;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<TourEntity, UUID> {

}
