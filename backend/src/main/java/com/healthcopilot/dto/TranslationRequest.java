package com.healthcopilot.dto;

public class TranslationRequest {
    private String text;
    private String englishText;
    private String targetLanguage;
    private String module;

    public TranslationRequest() {}

    public TranslationRequest(String text, String targetLanguage, String module) {
        this.text = text;
        this.targetLanguage = targetLanguage;
        this.module = module;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getEnglishText() {
        return englishText;
    }

    public void setEnglishText(String englishText) {
        this.englishText = englishText;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getTextToTranslate() {
        if (text != null && !text.trim().isEmpty()) {
            return text.trim();
        }
        return englishText != null ? englishText.trim() : "";
    }
}
