using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class Hakkimizda : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // Ekip üyelerini yükle
            LoadTeamMembers();
        }
    }

    private void LoadTeamMembers()
    {
        try
        {
            // Veritabanından ekip üyelerini çek
            DataTable dt = GetTeamMembersFromDatabase();
            
            // Repeater'a veri bağla
            rptTeamMembers.DataSource = dt;
            rptTeamMembers.DataBind();
        }
        catch (Exception ex)
        {
            // Hata durumunda loglama yapılabilir
            System.Diagnostics.Debug.WriteLine("Ekip üyeleri yüklenirken hata: " + ex.Message);
        }
    }

    private DataTable GetTeamMembersFromDatabase()
    {
        // Şu an veritabanı bağlantısını simüle etmek için test verileri oluşturuyoruz
        // Bu kısım gerçek veritabanı bağlantısı ile değiştirilecek
        DataTable dt = new DataTable();
        dt.Columns.Add("ID", typeof(int));
        dt.Columns.Add("Name", typeof(string));
        dt.Columns.Add("Title", typeof(string));
        dt.Columns.Add("Description", typeof(string));
        dt.Columns.Add("PhotoUrl", typeof(string));
        dt.Columns.Add("Email", typeof(string));
        dt.Columns.Add("LinkedIn", typeof(string));
        dt.Columns.Add("Twitter", typeof(string));

        // Örnek veriler
        dt.Rows.Add(1, "Prof. Dr. Ahmet Yılmaz", "Bölüm Başkanı", "10 yıllık akademik deneyime sahip veri bilimi uzmanı.", "Images/team/team1.jpg", "ahmet.yilmaz@senirkentmyo.edu.tr", "https://linkedin.com/in/ahmetyilmaz", "https://twitter.com/ahmetyilmaz");
        dt.Rows.Add(2, "Doç. Dr. Ayşe Kaya", "Öğretim Üyesi", "Yapay zeka ve makine öğrenmesi alanında uzman akademisyen.", "Images/team/team2.jpg", "ayse.kaya@senirkentmyo.edu.tr", "https://linkedin.com/in/aysekaya", "https://twitter.com/aysekaya");
        dt.Rows.Add(3, "Dr. Mehmet Demir", "Öğretim Görevlisi", "Web teknolojileri ve mobil uygulama geliştirme uzmanı.", "Images/team/team3.jpg", "mehmet.demir@senirkentmyo.edu.tr", "https://linkedin.com/in/mehmetdemir", "https://twitter.com/mehmetdemir");
        dt.Rows.Add(4, "Zeynep Çelik", "Araştırma Görevlisi", "Veritabanı sistemleri ve veri analizi konusunda deneyimli.", "Images/team/team4.jpg", "zeynep.celik@senirkentmyo.edu.tr", "https://linkedin.com/in/zeynepcelik", "https://twitter.com/zeynepcelik");

        return dt;
    }
}
