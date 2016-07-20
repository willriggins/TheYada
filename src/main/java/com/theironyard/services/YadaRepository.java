package com.theironyard.services;

import com.theironyard.entities.Yada;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by will on 7/18/16.
 */
public interface YadaRepository extends CrudRepository<Yada, Integer> {
//   Page<Yada> findByScoreDesc(Pageable pageable, int score);
//   Iterable<Yada> findByScoreAsc(int score);
}
