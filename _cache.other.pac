const SUPABASE_URL = process.env.SUPABASE_URL; 
const SUPABASE_KEY = process.env.SUPABASE_KEY; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
import { createClient } from '@supabase/supabase-js';

// Endpoint GET /api/animated-control
app.get('/api/animated-control', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('animated_status')
        .select('*')
        .single();
  
      if (error) {
        throw error;
      }
  
      res.json({
        status: 'success',
        data,
      });
    } catch (error) {
      console.error('Error fetching animated status:', error);
      res.status(500).json({
        status: 'error',
        message: 'Unable to fetch animated status.',
      });
    }
  });
  
  // Endpoint POST /api/animated-control
  app.post('/api/animated-control', async (req, res) => {
    try {
      const { data: currentStatus, error: fetchError } = await supabase
        .from('animated_status')
        .select('*')
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      const newStatus = !currentStatus.animated;
  
      const { data, error: updateError } = await supabase
        .from('animated_status')
        .update({ animated: newStatus })
        .eq('id', currentStatus.id);
  
      if (updateError) {
        throw updateError;
      }
  
      res.json({
        status: 'success',
        message: 'Status updated successfully.',
        data,
      });
    } catch (error) {
      console.error('Error updating animated status:', error);
      res.status(500).json({
        status: 'error',
        message: 'Unable to update animated status.',
      });
    }
  });