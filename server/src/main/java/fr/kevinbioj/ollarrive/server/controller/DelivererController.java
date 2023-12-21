package fr.kevinbioj.ollarrive.server.controller;

import fr.kevinbioj.ollarrive.server.business.AbstractBusinessException;
import fr.kevinbioj.ollarrive.server.business.SearchResultDto;
import fr.kevinbioj.ollarrive.server.business.ValidationException;
import fr.kevinbioj.ollarrive.server.business.deliverer.DelivererDto;
import fr.kevinbioj.ollarrive.server.business.deliverer.DelivererService;
import fr.kevinbioj.ollarrive.server.business.deliverer.exception.DelivererNotFoundException;
import fr.kevinbioj.ollarrive.server.business.deliverer.request.DelivererCreationRequest;
import fr.kevinbioj.ollarrive.server.business.deliverer.request.DelivererSearchRequest;
import fr.kevinbioj.ollarrive.server.business.deliverer.request.DelivererUpdateRequest;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@RequestMapping("/deliverers")
@RequiredArgsConstructor
public class DelivererController {

  private final DelivererService delivererService;

  // ---

  @GetMapping
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Recherche effectuée : les livreurs trouvés se trouvent dans la réponse."),
      @ApiResponse(responseCode = "400", content = @Content(oneOf = @Schema(ref = "org.springframework.http.ProblemDetail")))
  })
  public ResponseEntity<SearchResultDto<DelivererDto>> findMany(DelivererSearchRequest request)
      throws ValidationException {
    var results = delivererService.findMany(request);
    return ResponseEntity.ok(results);
  }

  @PostMapping
  public ResponseEntity<DelivererDto> create(@RequestBody DelivererCreationRequest request)
      throws ValidationException {
    var deliverer = delivererService.create(request);
    return ResponseEntity.created(URI.create("/deliverers/" + deliverer.getId())).body(deliverer);
  }

  @GetMapping("/{id}")
  public ResponseEntity<DelivererDto> findOne(@PathVariable UUID id)
      throws DelivererNotFoundException {
    var deliverer = delivererService.findOne(id);
    return ResponseEntity.ok(deliverer);
  }

  @PutMapping("/{id}")
  public ResponseEntity<DelivererDto> updateOne(@PathVariable UUID id, @RequestBody
  DelivererUpdateRequest request) throws DelivererNotFoundException, ValidationException {
    var deliverer = delivererService.updateOne(id, request);
    return ResponseEntity.ok(deliverer);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteOne(@PathVariable UUID id) throws DelivererNotFoundException {
    delivererService.deleteOne(id);
    return ResponseEntity.noContent().build();
  }

  // ---

  @ExceptionHandler({DelivererNotFoundException.class})
  public ProblemDetail notFoundException(AbstractBusinessException exception) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getDetails());
    pd.setTitle(exception.getCode());
    return pd;
  }
}
