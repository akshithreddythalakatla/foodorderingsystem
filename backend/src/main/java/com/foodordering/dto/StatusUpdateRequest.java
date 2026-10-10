package com.foodordering.dto;

import com.foodordering.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {
    @NotNull
    private OrderStatus status;

    private Long deliveryPersonnelId;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(OrderStatus status, Long deliveryPersonnelId) {
        this.status = status;
        this.deliveryPersonnelId = deliveryPersonnelId;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Long getDeliveryPersonnelId() {
        return deliveryPersonnelId;
    }

    public void setDeliveryPersonnelId(Long deliveryPersonnelId) {
        this.deliveryPersonnelId = deliveryPersonnelId;
    }
}
