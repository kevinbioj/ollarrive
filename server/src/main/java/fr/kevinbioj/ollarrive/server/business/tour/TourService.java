package fr.kevinbioj.ollarrive.server.business.tour;

import fr.kevinbioj.ollarrive.server.business.SearchResultDto;
import fr.kevinbioj.ollarrive.server.business.ValidationException;
import fr.kevinbioj.ollarrive.server.business.deliverer.DelivererRepository;
import fr.kevinbioj.ollarrive.server.business.deliverer.exception.DelivererNotFoundException;
import fr.kevinbioj.ollarrive.server.business.tour.exception.TourNotFoundException;
import fr.kevinbioj.ollarrive.server.business.tour.request.TourCreationRequest;
import fr.kevinbioj.ollarrive.server.business.tour.request.TourSearchRequest;
import fr.kevinbioj.ollarrive.server.business.tour.request.TourUpdateRequest;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.Validator;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TourService {

  private final DelivererRepository delivererRepository;
  private final TourRepository tourRepository;
  private final ModelMapper modelMapper;
  private final Validator validator;

  // ---

  /**
   * Crée une nouvelle tournée au sein de l'application.
   *
   * @param request Requête de création d'une tournée.
   * @return La tournée créée au sein de l'application.
   * @throws ValidationException La requête fournie est incorrecte.
   */
  public TourDto create(TourCreationRequest request) throws ValidationException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var tour = new TourEntity();
    tour.setName(request.getName());
    tour.setStartDate(request.getStartDate());
    tour.setEndDate(request.getEndDate());
    return modelMapper.map(tourRepository.save(tour), TourDto.class);
  }

  /**
   * Supprime une tournée de l'application.
   *
   * @param id Identifiant de la tournée à supprimer.
   * @throws TourNotFoundException Aucune tournée n'existe avec l'identifiant fourni.
   */
  public void deleteOne(UUID id) throws TourNotFoundException {
    if (!tourRepository.existsById(id)) {
      throw new TourNotFoundException(id);
    }
    tourRepository.deleteById(id);
  }

  /**
   * Récupère une tournée de l'application.
   *
   * @param id Identifiant de la tournée à récupérer.
   * @return La tournée récupérée, s'il existe.
   * @throws TourNotFoundException Aucune tournée n'existe avec l'identifiant fourni.
   */
  public TourDto findOne(UUID id) throws TourNotFoundException {
    var tour = tourRepository.findById(id)
        .orElseThrow(() -> new TourNotFoundException(id));
    return modelMapper.map(tour, TourDto.class);
  }

  /**
   * Recherche parmi les tournées de l'application.
   *
   * @return Les tournées trouvées selon les critères de recherche fournis.
   */
  public SearchResultDto<TourDto> findMany(TourSearchRequest request)
      throws ValidationException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var sort = Sort.by(
        Direction.fromString(Objects.requireNonNullElse(request.getSortOrder(), "asc")),
        Objects.requireNonNullElse(request.getSortBy(), "name")
    );
    var pageable = PageRequest.of(request.getPage(), request.getLimit(), sort);
    var specification = createSearchSpecification(request);
    var results = tourRepository.findAll(specification, pageable);
    return new SearchResultDto<>(
        results.map(d -> modelMapper.map(d, TourDto.class)).toList(),
        results.getNumber(),
        results.getTotalPages(),
        results.getSize(),
        results.getTotalElements()
    );
  }

  /**
   * Met à jour une tournée de l'application.
   *
   * @param id      Identifiant de la tournée à mettre à jour.
   * @param request Requête de mise à jour d'une tournée.
   * @return La tournée mise à jour, s'il existe.
   * @throws ValidationException        La requête fournie est incorrecte.
   * @throws TourNotFoundException Aucune tournée n'existe avec l'identifiant fourni.
   */
  public TourDto updateOne(UUID id, TourUpdateRequest request)
      throws ValidationException, TourNotFoundException, DelivererNotFoundException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var tour = tourRepository.findById(id)
        .orElseThrow(() -> new TourNotFoundException(id));
    tour.setName(request.getName());
    tour.setStartDate(request.getStartDate());
    tour.setEndDate(request.getEndDate());
    if (request.getDelivererId() != null) {
      var deliverer = delivererRepository.findById(request.getDelivererId())
          .orElseThrow(() -> new DelivererNotFoundException(id));
      tour.setDeliverer(deliverer);
    } else {
      tour.setDeliverer(null);
    }
    return modelMapper.map(tourRepository.save(tour), TourDto.class);
  }

  // ---

  private Specification<TourEntity> createSearchSpecification(TourSearchRequest request) {
    return ((root, query, builder) -> {
      List<Predicate> predicates = new ArrayList<>();
      if (request.getName() != null) {
        predicates.add(builder.like(builder.lower(root.get("name")),
            "%" + request.getName().toLowerCase() + "%"));
      }
      return builder.and(predicates.toArray(Predicate[]::new));
    });
  }
}
