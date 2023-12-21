package fr.kevinbioj.ollarrive.server.controller;

import fr.kevinbioj.ollarrive.server.business.AbstractBusinessException;
import fr.kevinbioj.ollarrive.server.business.SearchResultDto;
import fr.kevinbioj.ollarrive.server.business.ValidationException;
import fr.kevinbioj.ollarrive.server.business.deliverer.exception.DelivererNotFoundException;
import fr.kevinbioj.ollarrive.server.business.tour.TourDto;
import fr.kevinbioj.ollarrive.server.business.tour.TourService;
import fr.kevinbioj.ollarrive.server.business.tour.exception.TourNotFoundException;
import fr.kevinbioj.ollarrive.server.business.tour.request.TourCreationRequest;
import fr.kevinbioj.ollarrive.server.business.tour.request.TourSearchRequest;
import fr.kevinbioj.ollarrive.server.business.tour.request.TourUpdateRequest;
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
@RequestMapping("/tours")
@RequiredArgsConstructor
public class TourController {

  private final TourService tourService;

  // ---

  @GetMapping
  public ResponseEntity<SearchResultDto<TourDto>> findMany(TourSearchRequest request)
      throws ValidationException {
    var results = tourService.findMany(request);
    return ResponseEntity.ok(results);
  }

  @PostMapping
  public ResponseEntity<TourDto> create(@RequestBody TourCreationRequest request)
      throws ValidationException {
    var tour = tourService.create(request);
    return ResponseEntity.created(URI.create("/tours/" + tour.getId())).body(tour);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TourDto> findOne(@PathVariable UUID id)
      throws TourNotFoundException {
    var tour = tourService.findOne(id);
    return ResponseEntity.ok(tour);
  }

  @PutMapping("/{id}")
  public ResponseEntity<TourDto> updateOne(@PathVariable UUID id, @RequestBody
  TourUpdateRequest request)
      throws TourNotFoundException, ValidationException, DelivererNotFoundException {
    var tour = tourService.updateOne(id, request);
    return ResponseEntity.ok(tour);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteOne(@PathVariable UUID id) throws TourNotFoundException {
    tourService.deleteOne(id);
    return ResponseEntity.noContent().build();
  }

  // ---

  @ExceptionHandler({DelivererNotFoundException.class})
  public ProblemDetail badRequestException(AbstractBusinessException exception) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getDetails());
    pd.setTitle(exception.getCode());
    return pd;
  }

  @ExceptionHandler({TourNotFoundException.class})
  public ProblemDetail notFoundException(AbstractBusinessException exception) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getDetails());
    pd.setTitle(exception.getCode());
    return pd;
  }
}
