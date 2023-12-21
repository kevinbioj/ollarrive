package fr.kevinbioj.ollarrive.server.business.deliverer;

import fr.kevinbioj.ollarrive.server.business.SearchResultDto;
import fr.kevinbioj.ollarrive.server.business.ValidationException;
import fr.kevinbioj.ollarrive.server.business.deliverer.exception.DelivererNotFoundException;
import fr.kevinbioj.ollarrive.server.business.deliverer.request.DelivererCreationRequest;
import fr.kevinbioj.ollarrive.server.business.deliverer.request.DelivererSearchRequest;
import fr.kevinbioj.ollarrive.server.business.deliverer.request.DelivererUpdateRequest;
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
public class DelivererService {

  private final DelivererRepository delivererRepository;
  private final ModelMapper modelMapper;
  private final Validator validator;

  // ---

  /**
   * Crée un nouveau livreur au sein de l'application.
   *
   * @param request Requête de création d'un livreur.
   * @return Le nouveau livreur créé au sein de l'application.
   * @throws ValidationException La requête fournie est incorrecte.
   */
  public DelivererDto create(DelivererCreationRequest request) throws ValidationException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var deliverer = new DelivererEntity();
    deliverer.setName(request.getName());
    deliverer.setAvailable(request.getAvailable());
    return modelMapper.map(delivererRepository.save(deliverer), DelivererDto.class);
  }

  /**
   * Supprime un livreur de l'application.
   *
   * @param id Identifiant du livreur à supprimer.
   * @throws DelivererNotFoundException Aucun livreur n'existe avec l'identifiant fourni.
   */
  public void deleteOne(UUID id) throws DelivererNotFoundException {
    if (!delivererRepository.existsById(id)) {
      throw new DelivererNotFoundException(id);
    }
    delivererRepository.deleteById(id);
  }

  /**
   * Récupère un livreur de l'application.
   *
   * @param id Identifiant du livreur à récupérer.
   * @return Le livreur récupéré, s'il existe.
   * @throws DelivererNotFoundException Aucun livreur n'existe avec l'identifiant fourni.
   */
  public DelivererDto findOne(UUID id) throws DelivererNotFoundException {
    var deliverer = delivererRepository.findById(id)
        .orElseThrow(() -> new DelivererNotFoundException(id));
    return modelMapper.map(deliverer, DelivererDto.class);
  }

  /**
   * Recherche parmi les livreurs de l'application.
   *
   * @return Les livreurs trouvés selon les critères de recherche fournis.
   */
  public SearchResultDto<DelivererDto> findMany(DelivererSearchRequest request)
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
    var results = delivererRepository.findAll(specification, pageable);
    return new SearchResultDto<>(
        results.map(d -> modelMapper.map(d, DelivererDto.class)).toList(),
        results.getNumber(),
        results.getTotalPages(),
        results.getSize(),
        results.getTotalElements()
    );
  }

  /**
   * Met à jour un livreur de l'application.
   *
   * @param id      Identifiant du livreur à mettre à jour.
   * @param request Requête de mise à jour d'un livreur.
   * @return Le livreur mis à jour, s'il existe.
   * @throws ValidationException        La requête fournie est incorrecte.
   * @throws DelivererNotFoundException Aucun livreur n'existe avec l'identifiant fourni.
   */
  public DelivererDto updateOne(UUID id, DelivererUpdateRequest request)
      throws ValidationException, DelivererNotFoundException {
    var violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ValidationException(violations);
    }
    var deliverer = delivererRepository.findById(id)
        .orElseThrow(() -> new DelivererNotFoundException(id));
    deliverer.setName(request.getName());
    deliverer.setAvailable(request.getAvailable());
    return modelMapper.map(delivererRepository.save(deliverer), DelivererDto.class);
  }

  // ---

  private Specification<DelivererEntity> createSearchSpecification(DelivererSearchRequest request) {
    return ((root, query, builder) -> {
      List<Predicate> predicates = new ArrayList<>();
      if (request.getName() != null) {
        predicates.add(builder.like(builder.lower(root.get("name")),
            "*" + request.getName().toLowerCase() + "*"));
      }
      if (request.getAvailable() != null) {
        predicates.add(builder.equal(root.get("available"), request.getAvailable()));
      }
      if (request.getCreatedAfter() != null) {
        predicates.add(
            builder.greaterThanOrEqualTo(root.get("createdAt"), request.getCreatedAfter()));
      }
      if (request.getCreatedBefore() != null) {
        predicates.add(
            builder.lessThanOrEqualTo(root.get("createdAt"), request.getCreatedBefore()));
      }
      return builder.and(predicates.toArray(Predicate[]::new));
    });
  }
}
