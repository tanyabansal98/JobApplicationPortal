package com.job.portal.service;

/**
 * Shared helper/utility methods used across service classes.
 *
 * All methods are static — no instance needed.
 * Reused by every service to avoid code duplication.
 */
public class ServiceHelper {

    // ── Capitalize each word: "alice johnson" → "Alice Johnson" ──
    public static String capitalizeName(String name) {
        String[] words = name.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                if (sb.length() > 0)
                    sb.append(' ');
                sb.append(Character.toUpperCase(word.charAt(0)));
                sb.append(word.substring(1).toLowerCase());
            }
        }
        return sb.toString();
    }

    // ── Validate email format ──
    public static boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    // ── Check if a string is null or blank ──
    public static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
