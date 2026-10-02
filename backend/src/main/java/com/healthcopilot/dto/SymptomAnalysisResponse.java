package com.healthcopilot.dto;

import java.util.List;

public class SymptomAnalysisResponse {
    private String urgencyLevel;
    private String urgencyBadgeColor;
    private List<String> possibleExplanations;
    private String suggestedSpecialist;
    private List<String> warningSigns;
    private List<String> recommendedNextSteps;
    private String disclaimer;

    public SymptomAnalysisResponse() {}

    public SymptomAnalysisResponse(String urgencyLevel, String urgencyBadgeColor, List<String> possibleExplanations, String suggestedSpecialist, List<String> warningSigns, List<String> recommendedNextSteps, String disclaimer) {
        this.urgencyLevel = urgencyLevel;
        this.urgencyBadgeColor = urgencyBadgeColor;
        this.possibleExplanations = possibleExplanations;
        this.suggestedSpecialist = suggestedSpecialist;
        this.warningSigns = warningSigns;
        this.recommendedNextSteps = recommendedNextSteps;
        this.disclaimer = disclaimer;
    }

    public String getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(String urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public String getUrgencyBadgeColor() { return urgencyBadgeColor; }
    public void setUrgencyBadgeColor(String urgencyBadgeColor) { this.urgencyBadgeColor = urgencyBadgeColor; }

    public List<String> getPossibleExplanations() { return possibleExplanations; }
    public void setPossibleExplanations(List<String> possibleExplanations) { this.possibleExplanations = possibleExplanations; }

    public String getSuggestedSpecialist() { return suggestedSpecialist; }
    public void setSuggestedSpecialist(String suggestedSpecialist) { this.suggestedSpecialist = suggestedSpecialist; }

    public List<String> getWarningSigns() { return warningSigns; }
    public void setWarningSigns(List<String> warningSigns) { this.warningSigns = warningSigns; }

    public List<String> getRecommendedNextSteps() { return recommendedNextSteps; }
    public void setRecommendedNextSteps(List<String> recommendedNextSteps) { this.recommendedNextSteps = recommendedNextSteps; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
