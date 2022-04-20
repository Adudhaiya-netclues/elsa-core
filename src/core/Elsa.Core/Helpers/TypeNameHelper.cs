namespace Elsa.Helpers;

public static class TypeNameHelper
{
    public static string? GenerateNamespace(Type activityType) => activityType.Namespace;

    public static string GenerateTypeName(Type type, string? ns)
    {
        var typeName = type.Name;
        return ns != null ? $"{ns}.{typeName}" : typeName;
    }

    public static string GenerateTypeName<T>() => GenerateTypeName(typeof(T));

    public static string GenerateTypeName(Type type)
    {
        var ns = GenerateNamespace(type);
        return GenerateTypeName(type, ns);
    }

    public static string? GetCategoryFromNamespace(string? ns)
    {
        if (string.IsNullOrWhiteSpace(ns))
            return null;

        var index = ns.LastIndexOf('.');

        return index < 0 ? ns : ns[(index + 1)..];
    }
}