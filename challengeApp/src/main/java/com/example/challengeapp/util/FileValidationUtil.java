package com.example.challengeapp.util;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Component
public class FileValidationUtil {

    @Value("${app.upload.allowed-types}")
    private String allowedTypesString;

    @Value("${app.upload.max-file-size}")
    private String maxFileSizeString;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public boolean isValidImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return false;
        }

        // Check file extension
        String originalFilename = file.getOriginalFilename();
        if (StringUtils.isBlank(originalFilename)) {
            return false;
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            return false;
        }

        // Check MIME type
        String contentType = file.getContentType();
        if (StringUtils.isBlank(contentType) || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            return false;
        }

        // Additional security: check for malicious filenames
        if (containsSuspiciousCharacters(originalFilename)) {
            return false;
        }

        return true;
    }

    public String sanitizeFilename(String filename) {
        if (StringUtils.isBlank(filename)) {
            return "unknown";
        }

        // Remove path separators and other potentially dangerous characters
        String sanitized = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        
        // Ensure filename is not too long
        if (sanitized.length() > 100) {
            String extension = getFileExtension(sanitized);
            String name = sanitized.substring(0, 90);
            sanitized = name + "." + extension;
        }

        return sanitized;
    }

    private String getFileExtension(String filename) {
        if (StringUtils.isBlank(filename)) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        
        return filename.substring(lastDotIndex + 1);
    }

    private boolean containsSuspiciousCharacters(String filename) {
        // Check for path traversal attempts and other suspicious patterns
        String[] suspiciousPatterns = {
            "..", "/", "\\", ":", "*", "?", "\"", "<", ">", "|",
            "script", "javascript", "vbscript", "onload", "onerror"
        };

        String lowerFilename = filename.toLowerCase();
        for (String pattern : suspiciousPatterns) {
            if (lowerFilename.contains(pattern)) {
                return true;
            }
        }

        return false;
    }

    public String generateUniqueFilename(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String sanitizedName = sanitizeFilename(originalFilename);
        
        return System.currentTimeMillis() + "_" + sanitizedName;
    }
}