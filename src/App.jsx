import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Trash2, Download, Users, UserPlus } from 'lucide-react'
import * as XLSX from 'xlsx'
import logoApp from './assets/logoapp.png'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    razonSocial: '',
    direccion: '',
    telefono: '',
    tipoNegocio: ''
  })

  const [inscritos, setInscritos] = useState([])
  const [activeTab, setActiveTab] = useState('formulario')

  const tiposNegocio = [
    'ALIMENTOS',
    'SERVICIOS PROFESIONALES',
    'ENTRETENIMIENTO',
    'VIVERES',
    'ROPA',
    'HOGAR',
    'JUGUETES',
    'EDUCACION',
    'OTROS'
  ]

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('inscritos-ame')
    if (datosGuardados) {
      setInscritos(JSON.parse(datosGuardados))
    }
  }, [])

  // Guardar en localStorage cuando cambie la lista
  useEffect(() => {
    localStorage.setItem('inscritos-ame', JSON.stringify(inscritos))
  }, [inscritos])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar que todos los campos estén llenos
    if (!formData.nombreCliente || !formData.razonSocial || !formData.direccion || 
        !formData.telefono || !formData.tipoNegocio) {
      alert('Por favor, complete todos los campos')
      return
    }

    // Agregar fecha de inscripción
    const nuevoInscrito = {
      ...formData,
      id: Date.now(),
      fechaInscripcion: new Date().toLocaleDateString('es-ES')
    }

    setInscritos(prev => [...prev, nuevoInscrito])
    
    // Limpiar formulario
    setFormData({
      nombreCliente: '',
      razonSocial: '',
      direccion: '',
      telefono: '',
      tipoNegocio: ''
    })

    // Cambiar a la pestaña de inscritos
    setActiveTab('inscritos')
    
    alert('¡Inscripción registrada exitosamente!')
  }

  const eliminarInscrito = (id) => {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      setInscritos(prev => prev.filter(inscrito => inscrito.id !== id))
    }
  }

  const exportarExcel = () => {
    if (inscritos.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    // Preparar datos para Excel
    const datosExcel = inscritos.map(inscrito => ({
      'Nombre Cliente': inscrito.nombreCliente,
      'Razón Social': inscrito.razonSocial,
      'Dirección': inscrito.direccion,
      'Teléfono': inscrito.telefono,
      'Tipo de Negocio': inscrito.tipoNegocio,
      'Fecha Inscripción': inscrito.fechaInscripcion
    }))

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(datosExcel)

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 25 }, // Nombre Cliente
      { wch: 30 }, // Razón Social
      { wch: 40 }, // Dirección
      { wch: 15 }, // Teléfono
      { wch: 20 }, // Tipo de Negocio
      { wch: 15 }  // Fecha Inscripción
    ]
    ws['!cols'] = colWidths

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Inscritos AME')

    // Descargar archivo
    const fecha = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `inscritos-ame-${fecha}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="ame-header py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logoApp} alt="AME Logo" className="ame-logo" />
            <div className="text-white">
              <h1 className="text-2xl font-bold">Sistema de Inscripción</h1>
              <p className="text-sm opacity-90">Tu plata rinde</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white text-gray-800">
            <Users className="w-4 h-4 mr-1" />
            {inscritos.length} Inscritos
          </Badge>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="formulario" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Registro</span>
            </TabsTrigger>
            <TabsTrigger value="inscritos" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Inscritos ({inscritos.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Formulario de Inscripción */}
          <TabsContent value="formulario">
            <Card className="ame-card">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800">
                  Formulario de Inscripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombreCliente">Nombre del Cliente *</Label>
                      <Input
                        id="nombreCliente"
                        type="text"
                        value={formData.nombreCliente}
                        onChange={(e) => handleInputChange('nombreCliente', e.target.value)}
                        className="ame-input"
                        placeholder="Ingrese el nombre completo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="razonSocial">Razón Social *</Label>
                      <Input
                        id="razonSocial"
                        type="text"
                        value={formData.razonSocial}
                        onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                        className="ame-input"
                        placeholder="Ingrese la razón social"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        type="text"
                        value={formData.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        className="ame-input"
                        placeholder="Ingrese la dirección completa"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        className="ame-input"
                        placeholder="Ingrese el número de teléfono"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tipoNegocio">Tipo de Negocio *</Label>
                      <Select value={formData.tipoNegocio} onValueChange={(value) => handleInputChange('tipoNegocio', value)}>
                        <SelectTrigger className="ame-select">
                          <SelectValue placeholder="Seleccione el tipo de negocio" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposNegocio.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button type="submit" className="ame-button-primary px-8 py-3 text-lg">
                      Registrar Inscripción
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista de Inscritos */}
          <TabsContent value="inscritos">
            <Card className="ame-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-gray-800">
                    Lista de Inscritos
                  </CardTitle>
                  <Button 
                    onClick={exportarExcel}
                    className="ame-button-secondary"
                    disabled={inscritos.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {inscritos.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No hay inscritos registrados</p>
                    <p className="text-sm">Agregue el primer registro usando el formulario</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inscritos.map((inscrito) => (
                      <div key={inscrito.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
                          <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-medium">{inscrito.nombreCliente}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Razón Social</p>
                            <p className="font-medium">{inscrito.razonSocial}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Dirección</p>
                            <p className="font-medium">{inscrito.direccion}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">{inscrito.telefono}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tipo de Negocio</p>
                            <Badge variant="outline" className="text-xs">
                              {inscrito.tipoNegocio}
                            </Badge>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => eliminarInscrito(inscrito.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            Fecha de inscripción: {inscrito.fechaInscripcion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App

