/// Validate that a docker image reference is safe (no protocol, alphanumeric start).
pub fn validate_docker_image(image: &str) -> bool {
    if image.is_empty() || image.contains("://") {
        return false;
    }
    let first = image.as_bytes()[0];
    if !first.is_ascii_alphanumeric() {
        return false;
    }
    let basic_format_ok = image
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-' | '/' | ':'));

    if !basic_format_ok {
        return false;
    }

    let mut segments = image.split('/');
    let first_segment = segments.next().unwrap_or_default();
    let has_registry_prefix = image.contains('/') && first_segment.contains('.');
    if !has_registry_prefix {
        return true;
    }

    let trusted = std::env::var("TRUSTED_DOCKER_REGISTRIES").unwrap_or_default();
    let trusted: Vec<String> = trusted
        .split(',')
        .map(|item| item.trim())
        .filter(|item| !item.is_empty())
        .map(ToOwned::to_owned)
        .collect();

    !trusted.is_empty() && trusted.iter().any(|prefix| image.starts_with(prefix))
}

/// Validate that a file extension is safe (starts with dot, alphanumeric + dots only).
pub fn validate_extension(ext: &str) -> bool {
    !ext.is_empty()
        && ext.starts_with('.')
        && ext.len() <= 16
        && ext.chars().all(|c| c.is_ascii_alphanumeric() || c == '.')
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_docker_images() {
        assert!(validate_docker_image("judge-python:latest"));
        assert!(validate_docker_image("alpine:3.18"));
        unsafe {
            std::env::set_var("TRUSTED_DOCKER_REGISTRIES", "registry.example.com/");
        }
        assert!(validate_docker_image("registry.example.com/judge-rust:1.0"));
        unsafe {
            std::env::remove_var("TRUSTED_DOCKER_REGISTRIES");
        }
    }

    #[test]
    fn invalid_docker_images() {
        assert!(!validate_docker_image(""));
        assert!(!validate_docker_image("http://evil.com/image"));
        assert!(!validate_docker_image("../../../etc/passwd"));
        assert!(!validate_docker_image("-flag"));
        unsafe {
            std::env::remove_var("TRUSTED_DOCKER_REGISTRIES");
        }
        assert!(!validate_docker_image("registry.example.com/judge-rust:1.0"));
    }

    #[test]
    fn valid_extensions() {
        assert!(validate_extension(".py"));
        assert!(validate_extension(".cpp"));
        assert!(validate_extension(".rs"));
        assert!(validate_extension(".java"));
    }

    #[test]
    fn invalid_extensions() {
        assert!(!validate_extension(""));
        assert!(!validate_extension("py"));
        assert!(!validate_extension("/../../../etc"));
        assert!(!validate_extension(".a_very_long_extension_name"));
    }
}
