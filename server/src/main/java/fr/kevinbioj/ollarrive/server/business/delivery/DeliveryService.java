package fr.kevinbioj.ollarrive.server.business.delivery;

import fr.kevinbioj.ollarrive.server.business.SearchResultDto;
import fr.kevinbioj.ollarrive.server.business.ValidationException;
import fr.kevinbioj.ollarrive.server.business.delivery.exception.DeliveryNotFoundException;
import fr.kevinbioj.ollarrive.server.business.delivery.request.DeliveryCreationRequest;
import fr.kevinbioj.ollarrive.server.business.delivery.request.DeliverySearchRequest;
import fr.kevinbioj.ollarrive.server.business.delivery.request.DeliveryUpdateRequest;
import fr.kevinbioj.ollarrive.server.business.tour.TourRepository;
import fr.kevinbioj.ollarrive.server.business.tour.exception.TourNotFoundException;
import jakarta.validation.Validator;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class DeliveryService {

  private final DeliveryRepository deliveryRepository;
  private final ModelMapper modelMapper;
  private final TourRepository tourRepository;
  private final Validator validator;

  // ---

  /**
   * Crée une nouvelle livraison au sein de l'application.
   *
   * @param request Requête de création d'une livraison.
   * @return La livraison créée au sein de l'application.
   * @throws ValidationException La requête fournie est incorrecte.
   */
  public DeliveryDto create(DeliveryCreationRequest request) throws ValidationException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var delivery = new DeliveryEntity();
    delivery.setPickupAddress(request.getPickupAddress());
    delivery.setDeliveryAddress(request.getDeliveryAddress());
    return modelMapper.map(deliveryRepository.save(delivery), DeliveryDto.class);
  }

  /**
   * Supprime une livraison de l'application.
   *
   * @param id Identifiant de la livraison à supprimer.
   * @throws DeliveryNotFoundException Aucune livraison n'existe avec l'identifiant fourni.
   */
  public void deleteOne(UUID id) throws DeliveryNotFoundException {
    if (!deliveryRepository.existsById(id)) {
      throw new DeliveryNotFoundException(id);
    }
    deliveryRepository.deleteById(id);
  }

  /**
   * Récupère une tournée de l'application.
   *
   * @param id Identifiant de la tournée à récupérer.
   * @return La tournée récupérée, s'il existe.
   * @throws DeliveryNotFoundException Aucune tournée n'existe avec l'identifiant fourni.
   */
  public DeliveryDto findOne(UUID id) throws DeliveryNotFoundException {
    var tour = deliveryRepository.findById(id)
        .orElseThrow(() -> new DeliveryNotFoundException(id));
    return modelMapper.map(tour, DeliveryDto.class);
  }

  /**
   * Recherche parmi les tournées de l'application.
   *
   * @return Les tournées trouvées selon les critères de recherche fournis.
   */
  public SearchResultDto<DeliveryDto> findMany(DeliverySearchRequest request)
      throws ValidationException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var sort = Sort.by(
        Direction.fromString(Objects.requireNonNullElse(request.getSortOrder(), "asc")),
        Objects.requireNonNullElse(request.getSortBy(), "pickupAddress")
    );
    var pageable = PageRequest.of(request.getPage(), request.getLimit(), sort);
    var results = deliveryRepository.findAll(pageable);
    return new SearchResultDto<>(
        results.map(d -> modelMapper.map(d, DeliveryDto.class)).toList(),
        results.getNumber(),
        results.getTotalPages(),
        results.getSize(),
        results.getTotalElements()
    );
  }

  /**
   * Met à jour une livraison de l'application.
   *
   * @param id      Identifiant de la livraison à mettre à jour.
   * @param request Requête de mise à jour d'une livraison.
   * @return La livraison mise à jour, s'il existe.
   * @throws ValidationException        La requête fournie est incorrecte.
   * @throws DeliveryNotFoundException Aucune livraison n'existe avec l'identifiant fourni.
   */
  public DeliveryDto updateOne(UUID id, DeliveryUpdateRequest request)
      throws ValidationException, DeliveryNotFoundException, TourNotFoundException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var delivery = deliveryRepository.findById(id)
        .orElseThrow(() -> new DeliveryNotFoundException(id));
    delivery.setPickupAddress(request.getPickupAddress());
    delivery.setDeliveryAddress(request.getDeliveryAddress());
    if (request.getTourId() != null) {
      var tour = tourRepository.findById(request.getTourId())
          .orElseThrow(() -> new TourNotFoundException(id));
      delivery.setTour(tour);
    } else {
      delivery.setTour(null);
    }
    return modelMapper.map(deliveryRepository.save(delivery), DeliveryDto.class);
  }
}
