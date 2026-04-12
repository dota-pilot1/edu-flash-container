package com.eduflash.menu.application;

import com.eduflash.menu.domain.Menu;
import com.eduflash.menu.domain.MenuRepository;
import com.eduflash.menu.presentation.dto.MenuRequest;
import com.eduflash.menu.presentation.dto.MenuResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuRepository menuRepository;

    public List<MenuResponse> getMenuTree() {
        return menuRepository.findByParentIsNullOrderBySortOrderAsc().stream()
                .map(MenuResponse::from)
                .toList();
    }

    public List<MenuResponse> getMenusByDepth(Integer depth) {
        return menuRepository.findByDepthOrderBySortOrderAsc(depth).stream()
                .map(MenuResponse::from)
                .toList();
    }

    public MenuResponse getMenu(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. id=" + id));
        return MenuResponse.from(menu);
    }

    @Transactional
    public MenuResponse createMenu(MenuRequest request) {
        Menu parent = null;
        int depth = 1;

        if (request.getParentId() != null) {
            parent = menuRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("상위 메뉴를 찾을 수 없습니다. id=" + request.getParentId()));
            depth = parent.getDepth() + 1;
        }

        Menu menu = Menu.builder()
                .name(request.getName())
                .path(request.getPath())
                .parent(parent)
                .depth(depth)
                .sortOrder(request.getSortOrder())
                .visible(request.getVisible())
                .build();

        return MenuResponse.from(menuRepository.save(menu));
    }

    @Transactional
    public MenuResponse updateMenu(Long id, MenuRequest request) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. id=" + id));

        Menu parent = null;
        int depth = 1;

        if (request.getParentId() != null) {
            parent = menuRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("상위 메뉴를 찾을 수 없습니다. id=" + request.getParentId()));
            depth = parent.getDepth() + 1;
        }

        menu.update(request.getName(), request.getPath(), parent, depth, request.getSortOrder(), request.getVisible());

        return MenuResponse.from(menu);
    }

    @Transactional
    public void deleteMenu(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다. id=" + id));
        menuRepository.delete(menu);
    }
}
