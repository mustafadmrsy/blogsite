using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Web.Security;

public partial class Register : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Sayfa ilk kez yüklendiğinde ek işlemler yapılabilir
        if (!IsPostBack)
        {
            // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
            if (Session["UserID"] != null)
            {
                Response.Redirect("~/Default.aspx");
            }
        }
    }

    protected void btnRegister_Click(object sender, EventArgs e)
    {
        // Form doğrulama kontrolü
        if (!Page.IsValid)
        {
            return;
        }

        try
        {
            // Form verilerini al
            string name = txtName.Text.Trim();
            string email = txtEmail.Text.Trim();
            string password = txtPassword.Text;
            
            // Kullanıcı kayıt kontrolü
            if (IsEmailRegistered(email))
            {
                // Bu e-posta adresi zaten kayıtlı
                ShowError("Bu e-posta adresi zaten kullanılıyor. Farklı bir e-posta adresi deneyiniz veya giriş yapınız.");
                return;
            }
            
            // Kullanıcı kaydını gerçekleştir
            if (RegisterUser(name, email, password))
            {
                // Kayıt başarılı
                pnlRegisterError.Visible = false;
                pnlRegisterSuccess.Visible = true;
                litSuccessMessage.Text = "Hesabınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.";
                
                // Form alanlarını temizle
                ClearForm();
                
                // JavaScript ile 3 saniye sonra giriş sayfasına yönlendir
                string redirectScript = @"
                    setTimeout(function() {
                        window.location.href = 'Login.aspx';
                    }, 3000);";
                
                ClientScript.RegisterStartupScript(this.GetType(), "RedirectAfterSuccess", redirectScript, true);
            }
            else
            {
                // Kayıt başarısız
                ShowError("Hesap oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
            }
        }
        catch (Exception ex)
        {
            // Hata mesajını göster
            ShowError("Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
            
            // Hata loglanabilir
            System.Diagnostics.Debug.WriteLine("Kayıt hatası: " + ex.Message);
        }
    }
    
    protected void valTerms_ServerValidate(object source, ServerValidateEventArgs args)
    {
        // Kullanım koşullarının kabul edilip edilmediğini kontrol et
        args.IsValid = chkTerms.Checked;
    }
    
    private bool IsEmailRegistered(string email)
    {
        // Bu metod gerçek bir veritabanı bağlantısı ile değiştirilecek
        // Şu anda simüle edilmiş bir kontrol işlemi var
        
        // Simüle edilmiş kayıtlı e-posta adresleri
        List<string> registeredEmails = new List<string>
        {
            "admin@senirkentblog.com",
            "mehmet@example.com",
            "ayse@example.com"
        };
        
        return registeredEmails.Contains(email);
        
        // Örnek SQL sorgusu (veritabanı bağlantısı eklendiğinde bu kullanılabilir):
        // string connectionString = ConfigurationManager.ConnectionStrings["SenirkentBlogDB"].ConnectionString;
        // using (SqlConnection conn = new SqlConnection(connectionString))
        // {
        //     SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @Email", conn);
        //     cmd.Parameters.AddWithValue("@Email", email);
        //     
        //     conn.Open();
        //     int count = (int)cmd.ExecuteScalar();
        //     
        //     return count > 0;
        // }
    }
    
    private bool RegisterUser(string name, string password, string email)
    {
        // Bu metod gerçek bir veritabanı bağlantısı ile değiştirilecek
        // Şu anda simüle edilmiş bir kayıt işlemi var
        
        // Gerçek uygulamada, bu kullanıcıyı veritabanına ekleyecek kod buraya gelecek
        // Şifre güvenli bir şekilde hashlenmelidir
        
        // Başarılı kayıt simülasyonu
        return true;
        
        // Örnek SQL sorgusu (veritabanı bağlantısı eklendiğinde bu kullanılabilir):
        // string connectionString = ConfigurationManager.ConnectionStrings["SenirkentBlogDB"].ConnectionString;
        // using (SqlConnection conn = new SqlConnection(connectionString))
        // {
        //     SqlCommand cmd = new SqlCommand("INSERT INTO Users (Name, Email, Password, RegisterDate, IsActive) VALUES (@Name, @Email, @Password, @RegisterDate, @IsActive)", conn);
        //     cmd.Parameters.AddWithValue("@Name", name);
        //     cmd.Parameters.AddWithValue("@Email", email);
        //     cmd.Parameters.AddWithValue("@Password", HashPassword(password)); // Şifreyi hashle
        //     cmd.Parameters.AddWithValue("@RegisterDate", DateTime.Now);
        //     cmd.Parameters.AddWithValue("@IsActive", true);
        //     
        //     conn.Open();
        //     int result = cmd.ExecuteNonQuery();
        //     
        //     return result > 0;
        // }
    }
    
    private void ShowError(string message)
    {
        litErrorMessage.Text = message;
        pnlRegisterError.Visible = true;
        pnlRegisterSuccess.Visible = false;
    }
    
    private void ClearForm()
    {
        txtName.Text = string.Empty;
        txtEmail.Text = string.Empty;
        txtPassword.Text = string.Empty;
        txtConfirmPassword.Text = string.Empty;
        chkTerms.Checked = false;
    }
}
