package com.hospital.appointmentsystem.department.web;

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  📤 DEPARTMENT RESPONSE — İstemciye Dönen Veri Modeli           ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  📌 RESPONSE NEDİR?                                             ║
 * ║  API'nin istemciye döndürdüğü veriyi temsil eder.               ║
 * ║                                                                  ║
 * ║  Request'ten farkı:                                              ║
 * ║  → Response'da "id" VAR (çünkü istemci kaydedilen verinin      ║
 * ║    ID'sini bilmek ister)                                        ║
 * ║  → İleride ek bilgiler de eklenebilir                           ║
 * ║    (oluşturulma tarihi, güncellenme tarihi vb.)                 ║
 * ║                                                                  ║
 * ║  Örnek JSON yanıtı:                                              ║
 * ║  {                                                               ║
 * ║    "id": 1,                                                      ║
 * ║    "name": "Cardiology",                                        ║
 * ║    "description": "Heart and circulatory system"                ║
 * ║  }                                                               ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
public class DepartmentResponse {

    // İstemciye dönecek alanlar — id DAHİL
    private Long id;
    private String name;
    private String description;

    // Boş constructor
    public DepartmentResponse() {
    }

    public DepartmentResponse(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // ── Getter ve Setter ──

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
