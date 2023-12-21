package fr.kevinbioj.ollarrive.server.controller;

import fr.kevinbioj.ollarrive.server.business.AbstractBusinessException;
import fr.kevinbioj.ollarrive.server.business.SearchResultDto;
import fr.kevinbioj.ollarrive.server.business.ValidationException;
import fr.kevinbioj.ollarrive.server.business.delivery.DeliveryDto;
import fr.kevinbioj.ollarrive.server.business.delivery.DeliveryService;
import fr.kevinbioj.ollarrive.server.business.delivery.exception.DeliveryNotFoundException;
import fr.kevinbioj.ollarrive.server.business.delivery.request.DeliveryCreationRequest;
import fr.kevinbioj.ollarrive.server.business.delivery.request.DeliverySearchRequest;
import fr.kevinbioj.ollarrive.server.business.delivery.request.DeliveryUpdateRequest;
import fr.kevinbioj.ollarrive.server.business.tour.exception.TourNotFoundException;
import java.net.URI;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

  private final DeliveryService deliveryService;

  // ---

  @GetMapping
  public ResponseEntity<SearchResultDto<DeliveryDto>> findMany(DeliverySearchRequest request)
      throws ValidationException {
    var results = deliveryService.findMany(request);
    return ResponseEntity.ok(results);
  }

  @PostMapping
  public ResponseEntity<DeliveryDto> create(@RequestBody DeliveryCreationRequest request)
      throws ValidationException {
    var delivery = deliveryService.create(request);
    return ResponseEntity.created(URI.create("/deliveries/" + delivery.getId())).body(delivery);
  }

  @GetMapping("/{id}")
  public ResponseEntity<DeliveryDto> findOne(@PathVariable UUID id)
      throws DeliveryNotFoundException {
    var delivery = deliveryService.findOne(id);
    return ResponseEntity.ok(delivery);
  }

  @PutMapping("/{id}")
  public ResponseEntity<DeliveryDto> updateOne(@PathVariable UUID id, @RequestBody
  DeliveryUpdateRequest request)
      throws TourNotFoundException, ValidationException, DeliveryNotFoundException {
    var delivery = deliveryService.updateOne(id, request);
    return ResponseEntity.ok(delivery);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteOne(@PathVariable UUID id) throws DeliveryNotFoundException {
    deliveryService.deleteOne(id);
    return ResponseEntity.noContent().build();
  }

  // ---

  @ExceptionHandler({TourNotFoundException.class})
  public ProblemDetail badRequestException(AbstractBusinessException exception) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getDetails());
    pd.setTitle(exception.getCode());
    return pd;
  }

  @ExceptionHandler({DeliveryNotFoundException.class})
  public ProblemDetail notFoundException(AbstractBusinessException exception) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getDetails());
    pd.setTitle(exception.getCode());
    return pd;
  }
}
