package com.hospital.appointmentsystem.department.web;

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  📥 DEPARTMENT REQUEST — İstemciden Gelen Veri Modeli           ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  📌 REQUEST NEDİR?                                              ║
 * ║  Kullanıcının (istemcinin) API'ye gönderdiği veriyi temsil eder.║
 * ║                                                                  ║
 * ║  Neden ayrı bir sınıf?                                          ║
 * ║  → İstemci bize "id" GÖNDERMEZ (çünkü id otomatik oluşur)     ║
 * ║  → İstemci bize sadece gerekli bilgileri gönderir              ║
 * ║  → DTO'dan farklı olarak, sadece GİRİŞ verilerini içerir      ║
 * ║                                                                  ║
 * ║  Örnek JSON (POST /api/departments):                            ║
 * ║  {                                                               ║
 * ║    "name": "Cardiology",                                        ║
 * ║    "description": "Heart and circulatory system"                ║
 * ║  }                                                               ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
public class DepartmentRequest {

    // İstemciden gelecek alanlar — id YOK (otomatik oluşacak)
    private String name;
    private String description;

    // Boş constructor — Spring JSON'dan objeye çevirirken kullanır
    public DepartmentRequest() {
    }

    public DepartmentRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // ── Getter ve Setter ──

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
