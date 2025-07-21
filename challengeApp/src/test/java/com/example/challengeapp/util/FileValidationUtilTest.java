package com.example.challengeapp.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class FileValidationUtilTest {

    private FileValidationUtil fileValidationUtil;

    @BeforeEach
    void setUp() {
        fileValidationUtil = new FileValidationUtil();
        
        // Set test values using reflection
        ReflectionTestUtils.setField(fileValidationUtil, "allowedTypesString", "jpg,jpeg,png,gif,webp");
        ReflectionTestUtils.setField(fileValidationUtil, "maxFileSizeString", "5MB");
    }

    @Test
    void testIsValidImageFile_ValidJpegFile() {
        // Arrange
        MockMultipartFile validFile = new MockMultipartFile(
            "image",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(validFile);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testIsValidImageFile_ValidPngFile() {
        // Arrange
        MockMultipartFile validFile = new MockMultipartFile(
            "image",
            "test.png",
            "image/png",
            "test image content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(validFile);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testIsValidImageFile_ValidGifFile() {
        // Arrange
        MockMultipartFile validFile = new MockMultipartFile(
            "image",
            "test.gif",
            "image/gif",
            "test image content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(validFile);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testIsValidImageFile_ValidWebpFile() {
        // Arrange
        MockMultipartFile validFile = new MockMultipartFile(
            "image",
            "test.webp",
            "image/webp",
            "test image content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(validFile);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testIsValidImageFile_NullFile() {
        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(null);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testIsValidImageFile_EmptyFile() {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
            "image",
            "test.jpg",
            "image/jpeg",
            new byte[0]
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(emptyFile);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testIsValidImageFile_InvalidExtension() {
        // Arrange
        MockMultipartFile invalidFile = new MockMultipartFile(
            "file",
            "test.exe",
            "application/exe",
            "malicious content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(invalidFile);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testIsValidImageFile_InvalidMimeType() {
        // Arrange
        MockMultipartFile invalidFile = new MockMultipartFile(
            "file",
            "test.jpg",
            "application/exe", // Wrong MIME type
            "malicious content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(invalidFile);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testIsValidImageFile_TooLargeFile() {
        // Arrange
        byte[] largeContent = new byte[6 * 1024 * 1024]; // 6MB (exceeds 5MB limit)
        MockMultipartFile largeFile = new MockMultipartFile(
            "image",
            "large.jpg",
            "image/jpeg",
            largeContent
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(largeFile);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testIsValidImageFile_SuspiciousFilename() {
        // Arrange
        MockMultipartFile suspiciousFile = new MockMultipartFile(
            "image",
            "test<script>alert('xss')</script>.jpg",
            "image/jpeg",
            "test content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(suspiciousFile);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testIsValidImageFile_PathTraversalAttempt() {
        // Arrange
        MockMultipartFile maliciousFile = new MockMultipartFile(
            "image",
            "../../../etc/passwd.jpg",
            "image/jpeg",
            "test content".getBytes()
        );

        // Act
        boolean isValid = fileValidationUtil.isValidImageFile(maliciousFile);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testSanitizeFilename_NormalFilename() {
        // Act
        String sanitized = fileValidationUtil.sanitizeFilename("test-image_01.jpg");

        // Assert
        assertEquals("test-image_01.jpg", sanitized);
    }

    @Test
    void testSanitizeFilename_FilenameWithSpaces() {
        // Act
        String sanitized = fileValidationUtil.sanitizeFilename("test image with spaces.jpg");

        // Assert
        assertEquals("test_image_with_spaces.jpg", sanitized);
    }

    @Test
    void testSanitizeFilename_FilenameWithSpecialCharacters() {
        // Act
        String sanitized = fileValidationUtil.sanitizeFilename("test@#$%^&*()image.jpg");

        // Assert
        assertEquals("test__________image.jpg", sanitized);
    }

    @Test
    void testSanitizeFilename_EmptyFilename() {
        // Act
        String sanitized = fileValidationUtil.sanitizeFilename("");

        // Assert
        assertEquals("unknown", sanitized);
    }

    @Test
    void testSanitizeFilename_NullFilename() {
        // Act
        String sanitized = fileValidationUtil.sanitizeFilename(null);

        // Assert
        assertEquals("unknown", sanitized);
    }

    @Test
    void testSanitizeFilename_VeryLongFilename() {
        // Arrange
        String longFilename = "a".repeat(150) + ".jpg";

        // Act
        String sanitized = fileValidationUtil.sanitizeFilename(longFilename);

        // Assert
        assertTrue(sanitized.length() <= 100);
        assertTrue(sanitized.endsWith(".jpg"));
    }

    @Test
    void testGenerateUniqueFilename() {
        // Act
        String uniqueFilename1 = fileValidationUtil.generateUniqueFilename("test.jpg");
        String uniqueFilename2 = fileValidationUtil.generateUniqueFilename("test.jpg");

        // Assert
        assertNotNull(uniqueFilename1);
        assertNotNull(uniqueFilename2);
        assertNotEquals(uniqueFilename1, uniqueFilename2); // Should be unique
        assertTrue(uniqueFilename1.contains("test.jpg"));
        assertTrue(uniqueFilename2.contains("test.jpg"));
        assertTrue(uniqueFilename1.matches("\\d+_.*")); // Should start with timestamp
        assertTrue(uniqueFilename2.matches("\\d+_.*"));
    }

    @Test
    void testGenerateUniqueFilename_WithSpecialCharacters() {
        // Act
        String uniqueFilename = fileValidationUtil.generateUniqueFilename("test@#$image.jpg");

        // Assert
        assertNotNull(uniqueFilename);
        assertTrue(uniqueFilename.matches("\\d+_.*")); // Should start with timestamp
        // Should be sanitized
        assertFalse(uniqueFilename.contains("@"));
        assertFalse(uniqueFilename.contains("#"));
        assertFalse(uniqueFilename.contains("$"));
    }
}