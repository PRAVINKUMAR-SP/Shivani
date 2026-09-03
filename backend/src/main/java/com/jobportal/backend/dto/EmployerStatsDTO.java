package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerStatsDTO {
    private long activeListings;
    private long totalApplicants;
    private long shortlisted;
}
