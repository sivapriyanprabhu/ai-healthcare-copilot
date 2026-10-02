package com.healthcopilot.dto;

public class TranslationResponse {
    private String translatedText;
    private String originalText;
    private String sourceLanguage;
    private String targetLanguage;
    private boolean success;
    private String disclaimer;

    public TranslationResponse() {}

    public TranslationResponse(String translatedText, String originalText, String sourceLanguage, String targetLanguage, boolean success, String disclaimer) {
        this.translatedText = translatedText;
        this.originalText = originalText;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
        this.success = success;
        this.disclaimer = disclaimer;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getSourceLanguage() {
        return sourceLanguage;
    }

    public void setSourceLanguage(String sourceLanguage) {
        this.sourceLanguage = sourceLanguage;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
