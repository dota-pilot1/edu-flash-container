package com.eduflash.menu.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByParentIsNullOrderBySortOrderAsc();

    List<Menu> findByDepthOrderBySortOrderAsc(Integer depth);
}
