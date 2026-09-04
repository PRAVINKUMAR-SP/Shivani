package com.jobportal.backend.dto;

public class AdminStatsDTO {
    private long totalUsers;
    private long totalSeekers;
    private long totalEmployers;
    private long totalJobs;
    private long totalApplications;

    public AdminStatsDTO() {}

    public AdminStatsDTO(long totalUsers, long totalSeekers, long totalEmployers, long totalJobs, long totalApplications) {
        this.totalUsers = totalUsers;
        this.totalSeekers = totalSeekers;
        this.totalEmployers = totalEmployers;
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalSeekers() {
        return totalSeekers;
    }

    public void setTotalSeekers(long totalSeekers) {
        this.totalSeekers = totalSeekers;
    }

    public long getTotalEmployers() {
        return totalEmployers;
    }

    public void setTotalEmployers(long totalEmployers) {
        this.totalEmployers = totalEmployers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }
}
