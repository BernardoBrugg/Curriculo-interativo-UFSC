import urllib.request
import re
import sys

def get_course_name(curso_id):
    url = f"https://cagr.sistemas.ufsc.br/relatorios/curriculoCurso?curso={curso_id}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8', errors='ignore')
            m = re.search(r'CURRÍCULO DO CURSO.*?(\d{3})\s+-\s+(.*?)\s+-', html, re.DOTALL | re.IGNORECASE)
            if m:
                return m.group(2).strip()
            # Try another regex if the first fails
            m2 = re.search(r'Habilitação:.*?<td[^>]*>(.*?)</td>', html, re.DOTALL | re.IGNORECASE)
            if m2:
                return m2.group(1).strip()
    except Exception as e:
        pass
    return None

if len(sys.argv) > 1:
    print(get_course_name(sys.argv[1]))
else:
    for i in range(200, 300):
        name = get_course_name(i)
        if name:
            print(f"{i} - {name}")
