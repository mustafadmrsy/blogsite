using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace blogsite123
{
	public partial class _default : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
            SqlConnection baglanti=new SqlConnection("Data Source=213.238.183.232\\MSSQLSERVER2022;Initial Catalog=11Senirkent;User ID=11Senirkent;Password=H7jso6?64");       
            baglanti.Open();


            SqlCommand komut = new SqlCommand("select top 5 * from Posts order by PostId desc",baglanti);

            SqlDataAdapter adp = new SqlDataAdapter(komut);


            DataTable dt = new DataTable();

            adp.Fill(dt);

            Repeater1.DataSource = dt;
            Repeater1.DataBind();

            baglanti.Close();


        }           
	}
}