package fr.kevinbioj.ollarrive.server.business;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class SearchResultDto<T> {

  private List<T> items;
  private int page;
  private int pageCount;
  private int itemsPerPage;
  private long totalItems;
}
