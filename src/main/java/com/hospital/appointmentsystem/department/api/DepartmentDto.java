package com.hospital.appointmentsystem.department.api;

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  📦 DEPARTMENT DTO — Veri Transfer Objesi                       ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  📌 DTO NEDİR? (Data Transfer Object)                           ║
 * ║                                                                  ║
 * ║  DTO, katmanlar arasında veri taşıyan basit bir objedir.        ║
 * ║                                                                  ║
 * ║  Neden Entity'yi direkt kullanmıyoruz?                          ║
 * ║  → Entity veritabanıyla doğrudan bağlantılıdır.                ║
 * ║  → Entity'yi dışarıya açmak tehlikeli olabilir                 ║
 * ║    (şifre gibi hassas alanlar sızabilir).                       ║
 * ║  → DTO ile sadece göstermek istediğin alanları paylaşırsın.    ║
 * ║                                                                  ║
 * ║  Akış şöyle:                                                    ║
 * ║  Veritabanı → Entity → DTO → Dış dünya (API yanıtı)           ║
 * ║  Dış dünya → Request → DTO → Entity → Veritabanı              ║
 * ║                                                                  ║
 * ║  DTO, SERVICE KATMANINDA kullanılır.                             ║
 * ║  api paketinde olmasının sebebi: Service interface'i ile        ║
 * ║  birlikte bu paketin "dış dünyaya açık sözleşme" olmasıdır.    ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
public class DepartmentDto {

    private Long id;
    private String name;
    private String description;

    // Boş constructor
    public DepartmentDto() {
    }

    // Parametreli constructor — hızlı oluşturmak için
    public DepartmentDto(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // ── Getter ve Setter Metotları ──

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
