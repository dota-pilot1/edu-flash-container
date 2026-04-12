package com.eduflash.menu.presentation.dto;

import com.eduflash.menu.domain.Menu;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MenuResponse {

    private Long id;
    private String name;
    private String path;
    private Long parentId;
    private Integer depth;
    private Integer sortOrder;
    private Boolean visible;
    private List<MenuResponse> children;

    public static MenuResponse from(Menu menu) {
        return MenuResponse.builder()
                .id(menu.getId())
                .name(menu.getName())
                .path(menu.getPath())
                .parentId(menu.getParent() != null ? menu.getParent().getId() : null)
                .depth(menu.getDepth())
                .sortOrder(menu.getSortOrder())
                .visible(menu.getVisible())
                .children(menu.getChildren().stream()
                        .map(MenuResponse::from)
                        .toList())
                .build();
    }
}
